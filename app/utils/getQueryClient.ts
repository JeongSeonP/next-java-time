import { QueryClient } from "@tanstack/react-query";
import { cache } from "react";

const getQueryClient = cache(() => new QueryClient());

// 디폴트 옵션을 여기에도 추가하는게 맞을듯한데 확인해보기

export default getQueryClient;
