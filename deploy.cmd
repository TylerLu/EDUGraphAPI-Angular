:: Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
:: See LICENSE in the project root for license information.

IF EXIST "%~dp0%\src\EDUGraphAPI.Web\deploy.cmd" (
  call %~dp0%\src\EDUGraphAPI.Web\deploy.cmd
  popd
)
