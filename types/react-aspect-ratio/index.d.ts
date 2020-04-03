declare module "react-aspect-ratio" {
  import { ReactNode } from "react";

  interface AspectRatioProps {
    ratio: string | number;
    style?: Object;
    children?: ReactNode;
  }

  export default function AspectRatio(props: AspectRatioProps): JSX.Element;
}
