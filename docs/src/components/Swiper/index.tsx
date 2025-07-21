import { Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";
import "swiper/css/pagination";
import "./styles.css";

type Props = {
  images: unknown[];
};

const modules = [Pagination];

export default function CustomSwiper({ images }: Props) {
  return (
    <Swiper className="custom-swiper" modules={modules} pagination={true}>
      {images.map((image, index) => (
        <SwiperSlide key={index}>
          <img src={image} style={{ borderRadius: 10 }} />
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
