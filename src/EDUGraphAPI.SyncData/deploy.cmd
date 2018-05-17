:: Copyright (c) Microsoft Corporation. All rights reserved. Licensed under the MIT license.
:: See LICENSE in the project root for license information.

@if "%SCM_TRACE_LEVEL%" NEQ "4" @echo off


:Deployment
echo Deploying SyncData WebJob.

SET SYNCDATA_WEBJOB_PATH=%DEPLOYMENT_TARGET%\App_Data\jobs\triggered\SyncData

:: 1. Copy files
xcopy /y/s "%DEPLOYMENT_SOURCE%\src\EDUGraphAPI.SyncData\" "%SYNCDATA_WEBJOB_PATH%\"

:: 2. Install npm packages
pushd "%SYNCDATA_WEBJOB_PATH%"
call :ExecuteCmd !NPM_CMD! install
IF !ERRORLEVEL! NEQ 0 goto error
popd

:: 3. Gulp build
pushd "%SYNCDATA_WEBJOB_PATH%"
call .\node_modules\.bin\gulp build
	 IF !ERRORLEVEL! NEQ 0 goto error
popd

::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::
goto end

:: Execute command routine that will echo out when error
:ExecuteCmd
setlocal
set _CMD_=%*
call %_CMD_%
if "%ERRORLEVEL%" NEQ "0" echo Failed exitCode=%ERRORLEVEL%, command=%_CMD_%
exit /b %ERRORLEVEL%

:error
endlocal
echo An error has occurred during web site deployment.
call :exitSetErrorLevel
call :exitFromFunction 2>nul

:exitSetErrorLevel
exit /b 1

:exitFromFunction
()

:end
endlocal
echo Finished successfully.
