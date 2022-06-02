import Image from "next/image";
import { useTranslation } from "next-i18next";
import Link from "@components/ui/link";
import { ROUTES } from "@lib/routes";
import { useRouter } from "next/router";
import LinkButton from "@components/ui/link";
import Card from "@components/common/card";
import { fetchMe, useMeQuery } from "@data/user/use-me.query";

const Owner: React.FC = () => {
    const { t } = useTranslation("common");;
    const { query } = useRouter();
    const { data } = useMeQuery();

    return (
        <div className="h-full p-5 flex flex-col items-center">
            <div className="w-32 h-32 relative rounded-full flex items-center justify-center overflow-hidden border border-gray-200">
                <Image
                    src={data?.avatar?.thumbnail ?? "/avatar-placeholder.svg"}
                    layout="fill"
                />
            </div>
            <h3 className="text-lg font-semibold text-heading mt-4">{data?.userName!}</h3>
            <p className="text-sm text-muted mt-1">{data?.userEmail}</p>
            <p className="text-sm text-muted mt-1">{data?.userPhone}</p>
        </div>
    );
};
export default Owner;
