import {
  Ionicons,
  MaterialIcons,
  AntDesign,
  FontAwesome5,
  Feather,
  Entypo,
  MaterialCommunityIcons
} from "@expo/vector-icons";

const iconFamilies = {
  ion: Ionicons,
  material: MaterialIcons,
  ant: AntDesign,
  fa5: FontAwesome5,
  feather: Feather,
  entypo: Entypo,
  materialC:MaterialCommunityIcons
};

export default function GlobalIcon({
  family = "ion",
  name,
  size = 24,
  color = "black",
  ...props
}) {
  const IconComponent = iconFamilies[family];
  if (!IconComponent) {
    console.warn(`Icon family "${family}" not found`);
    return null;
  }
  return <IconComponent name={name} size={size} color={color} {...props} />;
}
