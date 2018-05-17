:: Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
:: See LICENSE in the project root for license information.

IF EXIST "%DEPLOYMENT_TARGET%\src\EDUGraphAPI.Web\deploy.cmd" (
  pushd "%DEPLOYMENT_TARGET%"
  call src\EDUGraphAPI.Web\deploy.cmd
  popd
)
