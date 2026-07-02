import { useMemo } from "react";
import { get } from "@/helper/object";
import { Service, useQuery, UseQueryOptions } from "./use-query";

interface UseOptionsConfig<TParams, TData> extends UseQueryOptions<TParams, TData> {
	/** 点号分隔路径，定位响应中的数组（如 "res.list"） */
	listPath: string;
	/** 映射为 option.label 的字段路径（如 "name"） */
	labelPath: string;
	/** 映射为 option.value 的字段路径（如 "id"） */
	valuePath: string;
}

export interface OptionItem {
	label: string;
	value: string;
}

export type OptionsItem = OptionItem;
export type OptionsMap = Record<string, OptionItem>;

/**
 * 获取下拉选项的 hook — 在 useQuery 基础上自动提取并转换为 {label, value}[] 格式
 *
 * @example
 * const { data, options, optionsMap, loading, run } = useOptions(apiGetBlueWhaleSystem, {
 *   listPath: 'res.list',
 *   labelPath: 'name',
 *   valuePath: 'id',
 *   defaultParams: { pageSize: 0 },
 * });
 *
 * // data       → ApiRowsResponse<CmdbCI<BlueWhaleSystemDTO>>  原始类型完整保留
 * // options    → { label: string; value: string }[]
 * // optionsMap → Record<string, { label: string; value: string }>
 */
export const useOptions = <TData, TParams = void>(
	api: Service<TData, TParams>,
	config: UseOptionsConfig<TParams, TData>
) => {
	const { listPath, labelPath, valuePath, ...queryOptions } = config;
	const queryResult = useQuery(api, queryOptions);
	const { data } = queryResult;

	const { options, optionsMap } = useMemo(() => {
		const _options: OptionItem[] = [];
		const _map: OptionsMap = {};

		if (!data) return { options: _options, optionsMap: _map };

		const list = get(data, listPath);

		if (!Array.isArray(list)) return { options: _options, optionsMap: _map };

		for (const item of list) {
			const opt: OptionItem = {
				label: String(get(item, labelPath) ?? ""),
				value: String(get(item, valuePath) ?? ""),
			};
			_options.push(opt);
			_map[opt.value] = opt;
		}

		return { options: _options, optionsMap: _map };
	}, [data]);

	return { ...queryResult, options, optionsMap };
};
