import { StoreProps } from "@/app/review/StoreSearch";
import axios from "axios";

const KAKAO_REST_API_KEY = process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY;

interface StationList {
  place_name: string;
}

export const getStation = async (x: string, y: string) => {
  try {
    const { data } = await axios.get(
      `https://dapi.kakao.com/v2/local/search/category.json?category_group_code=SW8&y=${y}&x=${x}&radius=1000`,
      {
        headers: {
          Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
        },
      }
    );
    const stationList = data.documents.map((data: StationList) =>
      data.place_name.slice(0, -4)
    );
    return stationList;
  } catch (error) {
    throw new Error(`getStation Error: Time(${new Date()}) ERROR ${error}`);
  }
};

export const getSearchedStoreInfo = async (storeName: string, page: number) => {
  try {
    const { data } = await axios.get(
      `https://dapi.kakao.com/v2/local/search/keyword.json?category_group_code=CE7&query=${storeName}&page=${page}&size=5`,
      {
        headers: {
          Authorization: `KakaoAK ${KAKAO_REST_API_KEY}`,
        },
      }
    );

    const placeInfo = data.documents;
    const isEnd = data.meta.is_end;

    return [placeInfo, isEnd];
  } catch (error) {
    throw new Error(
      `getSearchedStoreInfo Error: Time(${new Date()}) ERROR ${error}`
    );
  }
};
