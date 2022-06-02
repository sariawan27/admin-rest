import {
    QueryParamsType,
    UnitsQueryOptionsType,
} from "@ts-types/custom.types";
import { mapPaginatorData, stringifySearchQuery } from "@utils/data-mappers";
import { useQuery } from "react-query";
import Category from "@repositories/category";
import { API_ENDPOINTS } from "@utils/api/endpoints";
import { UnitPaginator } from "@ts-types/generated";
import ProductUnit from "@repositories/unit";

const fetchUnits = async ({
    queryKey,
}: QueryParamsType): Promise<{ units: UnitPaginator }> => {
    const [_key, params] = queryKey;

    const {
        page,
        text,
        type,
        limit = 15,
        orderBy = "updated_at",
        sortedBy = "DESC",
        parent = null,
    } = params as UnitsQueryOptionsType;

    const searchString = stringifySearchQuery({
        name: text,
        type,
    });
    // @ts-ignore
    const queryParams = new URLSearchParams({
        searchJoin: "and",
        orderBy,
        sortedBy,
        parent,
        limit: limit.toString(),
        search: text
        // ...(page && { page: page.toString() }),
        // ...(Boolean(searchString) && { search: searchString }),
    });
    const url = `${API_ENDPOINTS.PRODUCT_UNITS}?${queryParams.toString()}`;
    const {
        data: { data, ...rest },
    } = await ProductUnit.all(url);
    return {
        units: {
            data,
            paginatorInfo: mapPaginatorData({ ...rest }),
        },
    };
};

const useUnitsQuery = (options: UnitsQueryOptionsType) => {
    return useQuery<{ units: UnitPaginator }, Error>(
        [API_ENDPOINTS.PRODUCT_UNITS, options],
        fetchUnits,
        {
            keepPreviousData: true,
        }
    );
};

export { useUnitsQuery, fetchUnits };
