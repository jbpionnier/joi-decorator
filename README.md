# joi-decorator

Decorator based interface for [Joi](https://www.npmjs.com/package/joi).

## Installation

```sh
npm install joi-decorator reflect-metadata
```

## The basics

First you need to declare an entity:

```ts
import { mustBe, a } from "joi-decorator";

export class User {
    @mustBe(a.string().alphanum().min(3).max(30).required())
    public username: string;
    @mustBe(a.string().regex(/^[a-zA-Z0-9]{3,30}$/))
    public password: string;
    @mustBe([a.string(), a.number()])
    public accessToken: string|number;
    @mustBe(a.number().integer().min(1900).max(2013))
    public birthyear: number;
    @mustBe(a.string().email())
    public email: string;
    public constructor(
        username: string,
        password: string,
        access_token: string|number,
        birthyear: number,
        email: string
    ) {
        this.username = username;
        this.password = password;
        this.accessToken = accessToken;
        this.birthyear = birthyear;
        this.email = email;
    }
}
```

Then you can validate the entity instances:

#### Example 1: Valid entity

```ts
import { validate } from "joi-decorator";
import { expect } from "chai";
import {  User } from "./entities/user";

const validUser = new User(
    "root",
    "secret",
    "token",
    1989,
    "test@test.com"
);

const result1 = validate(validUser);
expect(result1.error).to.eql(null);
```

---

## License

Inspired by [zafiro-validators](https://github.com/ZafiroJS/zafiro-validators/).

[MIT License](LICENSE)

Copyright (c) Jean-Baptiste Pionnier
