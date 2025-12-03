import * as React from "react"
import Svg, { Path, Defs, LinearGradient, Stop } from "react-native-svg"
const SlideArrow = (props) => (
  <Svg
    xmlns="http://www.w3.org/2000/svg"
    width={24}
    height={24}
    fill="none"
    {...props}
  >
    <Path
      stroke="url(#a)"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={2}
      d="M14.43 5.93 20.5 12l-6.07 6.07"
    />
    <Path
      stroke="url(#b)"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      strokeWidth={2}
      d="M3.5 12h16.83"
    />
    <Defs>
      <LinearGradient
        id="a"
        x1={17.465}
        x2={17.465}
        y1={5.93}
        y2={18.07}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#F58D17" />
        <Stop offset={1} stopColor="#09BFCD" />
      </LinearGradient>
      <LinearGradient
        id="b"
        x1={11.915}
        x2={11.915}
        y1={12}
        y2={13}
        gradientUnits="userSpaceOnUse"
      >
        <Stop stopColor="#F58D17" />
        <Stop offset={1} stopColor="#09BFCD" />
      </LinearGradient>
    </Defs>
  </Svg>
)
export default SlideArrow
