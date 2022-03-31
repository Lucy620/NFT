# count-down-timer-react

> Use this module to get countdown timer by given date.

[![NPM](https://img.shields.io/npm/v/count-down-timer-react.svg)](https://www.npmjs.com/package/@nilevia/count-down-timer-react) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save @nilevia/count-down-timer-react
```

## Features
- Countdown Dourly ``12 : 34 : 01``
- Countdown Daily ``01 : 12 : 11 : 23``
- Custom Affix ``12 Hr 34 Day 01 Sec``
- Custom Operator ``12 - 02 - 59``
- Customable Style Using ``className``
- On Finish Callback using ``onFinish``

## Example
```jsx harmony
import React from 'react'

import { CountDownHourly, CountDownDaily } from 'count-down-timer-react'
import 'count-down-timer-react/dist/index.css'

const App = () => {
    const finishFunction = () =>{
        console.log("im finish")
    }
  return(
  <div className="txt-center-hoz">

    <CountDownHourly
      endDate={"2020-10-08T06:50:18.346Z"}
    />

    <CountDownDaily
      endDate={"2020-10-08T06:50:18.346Z"}
      dayAffix="Hari"
      hourAffix="Jam"
      minutesAffix="Menit"
      secondAffix="Detik"
      operator="-"
      onFinish={finishFunction}
    />

    <CountDownDaily
      endDate={"2020-10-08T06:50:18.346Z"}
      dayAffix="day"
      hourAffix="hrs"
      minutesAffix="min"
      secondAffix="sec"
      className="light-blue bold font-muli-20"
    />

    <CountDownDaily
      endDate={"2020-10-30T06:50:17.346Z"}
      dayAffix="Day"
      hourAffix="Hour"
      minutesAffix="Minutes"
      secondAffix="Second"
      className="red font-muli-20"
      operator=" "
    />

  </div>
  )
}

export default App

```

![demo](https://github.com/nilevia/count-down-timer-react/blob/master/image/demo.gif)



## License

MIT © [nilevia](https://github.com/nilevia)
