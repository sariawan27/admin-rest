import Select from "@components/ui/select/select";
import { useEffect, useState } from "react";
import { Controller } from "react-hook-form";
import { filter } from "lodash";

interface SelectInputProps {
  control: any;
  className: any;
  rules?: any;
  name: string;
  options: object[];
  [key: string]: unknown;
}

const SelectInput = ({
  control,
  options,
  name,
  rules,
  getOptionLabel,
  getOptionValue,
  isMulti,
  isClearable,
  isLoading,
  getValue,
  className,
  ...rest
}: SelectInputProps) => {
  // const [sv, setSv] = useState(getValue);

  // const handleChange = (value) => {
  //   let a = filter(options, (v) => {
  //     if (v.userGroupId == value) {
  //       return v;
  //     }
  //   })

  //   if (a.length > 0) {
  //     setSv({ label: a[0].userGroupName, value: a[0].userGroupId })
  //   }
  // }

  // handleChange(getValue);

  // useEffect(() => {
  //   console.log(sv)
  // })

  return (
    <Controller
      control={control}
      name={name}
      rules={rules}
      {...rest}
      render={({ field }) => (
        <Select
          {...field}
          getOptionLabel={getOptionLabel}
          getOptionValue={getOptionValue}
          isMulti={isMulti}
          isClearable={isClearable}
          isLoading={isLoading}
          // onChange={value => setSv(value)}
          defaultValue={getValue}
          options={options}
          className={className}
        />
      )}
    />
  );
};

export default SelectInput;
