'use strict'

import { Dimensions } from 'react-native'

class Device { }

Object.defineProperties(Device, {
  width: {
    get: () => Dimensions.get('window').width
  },

  height: {
    get: () => Dimensions.get('window').height
  }
})

export default Device
