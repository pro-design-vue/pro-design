---
outline: deep
---

# 请求与数据

Pro Design Admin 初始化的项目中，采用 `axios` 做为请求的资源库，并对其做了封装，可以从`src/shared/request`的路径中引入封装的 `request`，
在`api/request`进行了适配业务的二次封装，你可以在此处适配自己的业务逻辑，并在具体场景中使用。我们建议您在`src/api/core`目录中管理您的项目使用到的 api，并在具体组件/页面中使用。 大部分情况下，您不需要改动`api/request`中的代码，只需要在`src/api/core`目录中新增您使用的接口，并在页面中引入接口使用即可。

```ts
import type { AppData, AuthSigninParams, AuthSigninResult, MenuData, UserData } from '@/typings'

import type { ResponseData } from '@/api/request'

import { baseRequestClient, requestClient, mockClient } from '@/api/request'

const BASE_PATH = '/v1/auth'

export const authLoginApi = (params: AuthSigninParams) =>
  mockClient.post<ResponseData<AuthSigninResult>>(`${BASE_PATH}/login`, params)
export const getAuthUserInfo = () => mockClient.get<ResponseData<UserData>>(`${BASE_PATH}/user`)
export const getAuthMenuList = () => mockClient.get<ResponseData<MenuData[]>>(`${BASE_PATH}/menus`)
export const getAuthApps = () => mockClient.get<ResponseData<AppData[]>>(`${BASE_PATH}/apps`)
```

## 请求代理

项目本地开发中可以在`.env.development`配置文件的中的`VITE_PROXY`环境变量配置代理地址。

```ts
// 支持配置多个
VITE_PROXY = [["/api","http://localhost:6100/api"]]
```

## Mock 数据

如果需要进行数据 Mock，在`.env`配置文件的中的`VITE_REQUEST_MOCK`环境变量是对应是否启用Mcok数据的开关。

在 `src/mock/index.ts` 配置mock的地址，在 `src/mock/data` 目录下配置mock的数据。

::: warning
mockClient 和 requestClient需要区分开。
:::

```ts
import { mockClient } from '@/api/request'

export const getAuthApps = () => mockClient.get<ResponseData<AppData[]>>(`${BASE_PATH}/apps`)
```