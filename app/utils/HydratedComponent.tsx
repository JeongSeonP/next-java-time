import { Hydrate, HydrateProps } from "@tanstack/react-query";

const HydratedComponent = async (props: HydrateProps) => {
  return <Hydrate {...props} />;
};

export default HydratedComponent;
