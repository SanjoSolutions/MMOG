import {
  decode as decodeWithMessagePack,
  encode as encodeWithMessagePack,
} from '@msgpack/msgpack'

const indexToPropertyName = Symbol('indexToPropertyName')
const propertyNameToIndex = Symbol('propertyNameToIndex')

export function index(index: number) {
  return function (prototype: any, propertyName: any) {
    if (!prototype[indexToPropertyName]) {
      prototype[indexToPropertyName] = new Map()
    }
    prototype[indexToPropertyName].set(index, propertyName)

    if (!prototype[propertyNameToIndex]) {
      prototype[propertyNameToIndex] = new Map()
    }
    prototype[propertyNameToIndex].set(propertyName, index)
  }
}

export type PropertyNamesToIndexes = {
  [propertyName: string]:
    | number
    | { index: number; propertyNamesToIndexes: PropertyNamesToIndexes }
}
export type IndexesToPropertyNames = {
  [index: number]:
    | string
    | { propertyName: string; indexesToPropertyNames: IndexesToPropertyNames }
}
export type PropertyNamesToClasses = {
  [propertyName: string]: {
    Class: any
    propertyNamesToClasses: PropertyNamesToClasses
  }
}

export function encode(
  object: any,
  propertyNamesToIndexes: PropertyNamesToIndexes
): Uint8Array {
  const data = convertObjectToArray(object, propertyNamesToIndexes)
  return encodeWithMessagePack(data)
}

function convertObjectToArray(
  object: any,
  propertyNamesToIndexes: PropertyNamesToIndexes
): any[] {
  const data = []
  for (const propertyName in object) {
    const entry = propertyNamesToIndexes[propertyName]
    if (typeof entry === 'object') {
      const index = entry.index
      data[index] = convertObjectToArray(
        object[propertyName],
        entry.propertyNamesToIndexes
      )
    } else if (typeof entry === 'number') {
      const index = entry
      data[index] = object[propertyName]
    }
  }
  return data
}

export function decode<T>(
  encodedData: Uint8Array,
  indexesToPropertyNames: IndexesToPropertyNames,
  propertyNamesToClasses: PropertyNamesToClasses,
  Class?: any
): typeof Class | object {
  const data = decodeWithMessagePack(encodedData) as any[]
  return convertArrayToObject(
    data,
    indexesToPropertyNames,
    propertyNamesToClasses
  )
}

function convertArrayToObject(
  data: any[],
  indexesToPropertyNames: IndexesToPropertyNames,
  propertyNamesToClasses: PropertyNamesToClasses,
  Class?: any
): typeof Class | object {
  const object: any = Class ? new Class() : {}
  for (const indexAsString in data) {
    const index = Number(indexAsString)
    const propertyName =
      typeof indexesToPropertyNames[index] === 'string'
        ? indexesToPropertyNames[index]
        : indexesToPropertyNames[index].propertyName
    if (propertyName) {
      let value
      const valueAtIndex = data[index]
      if (propertyNamesToClasses[propertyName]) {
        if (Array.isArray(valueAtIndex)) {
          value = convertArrayToObject(
            valueAtIndex as any[],
            indexesToPropertyNames,
            propertyNamesToClasses[propertyName].Class
          )
        } else if (typeof valueAtIndex === 'object') {
        } else {
          throw new Error('ajksldjkadlssadjkl')
        }
        value = convertArrayToObject(
          valueAtIndex as any[],
          indexesToPropertyNames,
          propertyNamesToClasses[propertyName].Class
        )

        value = new propertyNamesToClasses[propertyName].Class()
        Object.assign(value, valueAtIndex)
        for (const [propertyName, propertyValue] of valueAtIndex) {
          if (
            propertyNamesToClasses[propertyName].propertyNamesToClasses[
              propertyName
            ]
          ) {
            value[propertyName] = convertArrayToClassInstance2(propertyValue)
          } else {
            value[propertyName] = propertyValue
          }
        }
      } else {
        value = valueAtIndex
      }
      object[propertyName] = value
    }
  }
  return object
}

export function encodeClassInstance(object: any): Uint8Array {
  const data = []
  const prototype = Object.getPrototypeOf(object)
  for (const propertyName in object) {
    const index = prototype[propertyNameToIndex].get(propertyName)
    if (typeof index === 'number') {
      data[index] = object[propertyName]
    }
  }
  return encodeWithMessagePack(data)
}

export function decodeAsClassInstance(
  encodedData: Uint8Array,
  Class: any
): typeof Class {
  const data = decodeWithMessagePack(encodedData) as any[]
  return convertArrayToClassInstance(data, Class)
}

function convertArrayToClassInstance(array: any[], Class: any): typeof Class {
  const object = new Class()
  for (const indexAsString in array) {
    const index = Number(indexAsString)
    const propertyName = Class.prototype[indexToPropertyName].get(index)
    if (propertyName) {
      object[propertyName] = array[index]
    }
  }
  return object
}

class Test {
  @index(0)
  a: boolean = false
  @index(1)
  b: boolean = false
}

console.log(Test.prototype)

const test = new Test()
test.a = true
const encoded = encode(test)
console.log('encoded', encoded)
const decoded = decodeAsClassInstance(encoded, Test)
console.log('decoded', decoded)
