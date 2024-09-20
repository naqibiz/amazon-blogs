"use client";
import * as React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const SkeletonLoader = ({ width, height, containerClassName, count }) => {
  return (
    <Skeleton
      height={height ? height : 40}
      width={width}
      containerClassName={containerClassName}
      count={count ? count : 1}
    />
  );
};

export default SkeletonLoader;
