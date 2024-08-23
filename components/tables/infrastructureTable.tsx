import React, { useState, useEffect } from "react";
import Image from "next/image";
import TableHeader from "@/components/tables/tableHeader";
import { Infrastructure } from "@/components/infrastructure/infrastructureProps";
import { MobileView, isMobile } from "react-device-detect";
import Link from "next/link";
import { useQueryState } from "nuqs";

type TableTabKey =
    | "Type"
    | "Purpose"
    | "Status"
    | "Unit of Account"
    | "Associated Layers";

interface Props {
    data: Infrastructure[];
    headers: {
        name: string;
        showSorting: boolean;
        filterOptions?: string[];
        mobileLabel: string;
    }[];
}

const InfrastructureImage = ({
    src,
    title,
}: {
    src: string;
    title: string;
}) => {
    const [imageSrc, setImageSrc] = useState(src);

    const handleError = () => {
        setImageSrc("/bitcoinlayers-logo.png");
    };

    return (
        <Image
            src={imageSrc}
            alt={`${title} logo`}
            width={20}
            height={20}
            onError={handleError}
        />
    );
};

const InfrastructureTable = ({ data, headers }: Props) => {
    const [filter, setFilter] = useQueryState("filter", { defaultValue : "Mainnet" });

    const [sortedData, setSortedData] = useState(data);
    const [mobileActiveTab, setMobileActiveTab] = useState<TableTabKey>("Type");

    useEffect(() => {
        handleSort("Name", true);
    }, []);

    const handleSort = (header: string, ascending: boolean) => {
        const sorted = [...sortedData].sort((a, b) => {
            let valueA, valueB;
            switch (header) {
                case "Name":
                    valueA = a.title.toLowerCase();
                    valueB = b.title.toLowerCase();
                    break;
                case "Type":
                    valueA = a.infrastructureType;
                    valueB = b.infrastructureType;
                    break;
                case "Purpose":
                    valueA = a.purpose;
                    valueB = b.purpose;
                    break;
                case "Status":
                    valueA = a.live;
                    valueB = b.live;
                    break;
                case "Unit of Account":
                    valueA = a.nativeToken;
                    valueB = b.nativeToken;
                    break;
                case "Associated Layers":
                    valueA = a.associatedLayers;
                    valueB = b.associatedLayers;
                    break;
                default:
                    return 0;
            }
            if (valueA < valueB) return ascending ? -1 : 1;
            if (valueA > valueB) return ascending ? 1 : -1;
            return 0;
        });
        setSortedData(sorted);
    };

    const handleFilter = (header: string, value: string) => {
        setFilter(value as "Mainnet" | "Testnet" | "All");
    };

    const filteredData = sortedData.filter((item) => {
        if (filter === "Mainnet") return item.live === "Mainnet";
        if (filter === "Testnet") return item.live !== "Mainnet";
        return true;
    });

    const handleMobileTabClick = (tab: TableTabKey) => {
        setMobileActiveTab(tab);
    };

    const mobileTableHeaders = headers.filter(
        (_item) => _item.name === mobileActiveTab || _item.name === "Name",
    );

    return (
        <div className="px-6 lg:px-0 w-full">
            <div className="flex lg:mb-6 justify-center -mt-12 lg:mt-0 relative z-20">
                <div className="justify-start items-start gap-4 inline-flex">
                    <div
                        className={`h-[30px] px-4 py-[5px] rounded-full border-2 justify-center items-center gap-1.5 flex cursor-pointer ${
                            filter === "Mainnet"
                                ? "bg-white border-orange-600"
                                : "border-slate-300"
                        }`}
                        onClick={() => setFilter("Mainnet")}
                    >
                        <div
                            className={`text-center text-sm font-medium leading-tight ${
                                filter === "Mainnet"
                                    ? "text-orange-600"
                                    : "text-slate-600"
                            }`}
                        >
                            Mainnet
                        </div>
                    </div>
                    <div
                        className={`h-[30px] rounded-full border-2 justify-center items-center gap-1 flex cursor-pointer ${
                            filter === "Testnet"
                                ? "bg-white border-orange-600"
                                : "border-slate-300"
                        }`}
                        onClick={() => setFilter("Testnet")}
                    >
                        <div className="grow shrink basis-0 h-[30px] px-4 py-[5px] justify-center items-center gap-1.5 flex">
                            <div
                                className={`text-center text-sm font-medium leading-tight ${
                                    filter === "Testnet"
                                        ? "text-orange-600"
                                        : "text-slate-600"
                                }`}
                            >
                                Testnet
                            </div>
                        </div>
                    </div>
                    <div
                        className={`h-[30px] rounded-full border-2 justify-center items-center gap-1 flex cursor-pointer ${
                            filter === "All"
                                ? "bg-white border-orange-600"
                                : "border-slate-300"
                        }`}
                        onClick={() => setFilter("All")}
                    >
                        <div className="grow shrink basis-0 h-[30px] px-4 py-[5px] justify-center items-center gap-1.5 flex">
                            <div
                                className={`text-center text-sm font-medium leading-tight ${
                                    filter === "All"
                                        ? "text-orange-600"
                                        : "text-slate-600"
                                }`}
                            >
                                All
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <MobileView className="flex justify-center">
                <div className="justify-center lg:items-start gap-4 inline-flex py-3">
                    {headers.slice(1).map((_item, ind) => {
                        const isAllowedTab = [
                            "Type",
                            "Status",
                            "Unit of Account",
                            "Associated Layers",
                        ].includes(_item.name);
                        return (
                            <div
                                className={`h-[30px] px-4 py-[5px] rounded-full border-2 justify-center items-center gap-1.5 flex cursor-pointer ${
                                    mobileActiveTab === _item.name
                                        ? "bg-white border-orange-600"
                                        : "border-slate-300"
                                }`}
                                onClick={() =>
                                    isAllowedTab &&
                                    handleMobileTabClick(
                                        _item.name as TableTabKey,
                                    )
                                }
                                key={ind}
                            >
                                <div
                                    className={`text-center text-sm font-medium leading-tight ${
                                        mobileActiveTab === _item.name
                                            ? "text-orange-600"
                                            : "text-slate-600"
                                    }`}
                                >
                                    {_item.mobileLabel}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </MobileView>
            <div className="overflow-x-auto bg-lightsecondary rounded-xl mx-auto border border-stroke_tertiary">
                <table className="bg-lightsecondary w-full text-sm text-left rtl:text-right rounded-xl">
                    <TableHeader
                        headers={isMobile ? mobileTableHeaders : headers}
                        onSort={handleSort}
                        onFilter={handleFilter}
                    />
                    <tbody className="bg-white gap-x-8 border-t border-stroke_tertiary text_table_important">
                        {filteredData.map((item, index) => (
                            <tr
                                className={`cursor-pointer border-b border-stroke_tertiary text_table_important ${
                                    index === filteredData.length - 1 ? "" : ""
                                }`}
                                key={item.slug}
                            >
                                <td className="lg:px-6 px-4 py-4 font-semibold whitespace-nowrap border-r lg:border-r-0 border-stroke_tertiary text_table_important text-table_body">
                                    <Link
                                        href={`/infrastructure/${item.slug}`}
                                        className="flex items-center"
                                    >
                                        <InfrastructureImage
                                            src={`/logos/${item.slug}.png`}
                                            title={item.title}
                                        />
                                        <span className="ml-2 lg:word-break-none">
                                            {item.title}
                                        </span>
                                    </Link>
                                </td>

                                {(!isMobile || mobileActiveTab === "Type") && (
                                    <td className="lg:px-6 px-4 py-3 lg:py-4 border-stroke_tertiary text_table_important">
                                        <Link
                                            href={`/infrastructure/${item.slug}`}
                                        >
                                            {" "}
                                            {item.infrastructureType}
                                        </Link>
                                    </td>
                                )}
                                {(!isMobile ||
                                    mobileActiveTab === "Status") && (
                                    <td className="lg:px-6 px-4 py-3 lg:py-4 border-stroke_tertiary text_table_important">
                                        <Link
                                            href={`/infrastructure/${item.slug}`}
                                        >
                                            {" "}
                                            {item.live}
                                        </Link>
                                    </td>
                                )}
                                {(!isMobile ||
                                    mobileActiveTab === "Unit of Account") && (
                                    <td className="lg:px-6 px-4 py-3 lg:py-4 border-stroke_tertiary text_table_important">
                                        <Link
                                            href={`/infrastructure/${item.slug}`}
                                        >
                                            <div className="flex items-center">
                                                {item.nativeToken
                                                    .toLowerCase()
                                                    .includes("btc") && (
                                                    <Image
                                                        src="/btc.svg"
                                                        alt="BTC logo"
                                                        width={20}
                                                        height={20}
                                                        className="mr-2"
                                                    />
                                                )}
                                                {item.nativeToken}
                                            </div>
                                        </Link>
                                    </td>
                                )}
                                {(!isMobile ||
                                    mobileActiveTab ===
                                        "Associated Layers") && (
                                    <td className="lg:px-6 px-4 py-3 lg:py-4 border-r border-stroke_tertiary text_table_important">
                                        <Link
                                            href={`/infrastructure/${item.slug}`}
                                        >
                                            {item.associatedLayers}
                                        </Link>
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default InfrastructureTable;
