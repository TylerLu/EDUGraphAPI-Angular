:: Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
:: See LICENSE in the project root for license information.


echo %cd%

IF EXIST "%~dp0%\src\EDUGraphAPI.Web\deploy.cmd" (
  pushd "%~dp0%\src\EDUGraphAPI.Web%"
  call deploy.cmd
  popd
)
