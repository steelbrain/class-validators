# class-validators

`class-validators` is runtime parameter validation for JS functions! Think PropTypes but function specific.

### Installation

```
npm install --save class-validators
```

### Usage

```js
import { t, validateMethod } from 'class-validators'

class Person {
  name = ''
  age = 0
  family = []

  @validateMethod(String)
  setName(name) {
    this.name = name
  }

  @validateMethod(Number)
  setAge(age) {
    this.age = age
  }

  @validateMethod({
    name: String,
    age: Number,
  })
  addFamilyMember(member) {
    this.family.push(member)
  }

  @validateMethod(t.varargs({
    name: String,
    age: Number,
  }))
  addFamilyMembers(...members) {
    this.family.push(...members)
  }
}

const person = new Person()

person.setName('Steve Jobs') // No error
person.setName(5) // Throws Person#setName() expects parameter 1 to be string. Got: number
```

### API

```
export const t = {
  varargs(type),
  optional(type),
  any(),
  instanceOf(class),
}
export validateMethod(...types)
```

### License

This project is licensed under the terms of MIT License. See `LICENSE` file for more info.
