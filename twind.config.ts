import { Options } from "$fresh/plugins/twind.ts";
import * as colors from "twind/colors";

export default {
  selfURL: import.meta.url,
  darkMode: 'class',
  theme: {
    colors: {
      black: colors.black,
      blue: colors.blue,
      blueGray: colors.blueGray,
      coolGray: colors.coolGray,
      cyan: colors.cyan,
      emerald: colors.emerald,
      fuchsia: colors.fuchsia,
      gray: colors.gray,
      green: colors.green,
      indigo: colors.indigo,
      lime: colors.lime,
      orange: colors.orange,
      pink: colors.pink,
      purple: colors.purple,
      red: colors.red,
      rose: colors.rose,
      sky: colors.sky,
      violet: colors.violet,
      white: colors.white,
      yellow: colors.yellow,
      current: "currentColor",
      transparent: "transparent",
    },
  }
} as Options;