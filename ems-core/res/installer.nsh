!include "LogicLib.nsh"
!include "x64.nsh"

!define PRODUCT_GROUP "TheOrangeAlliance"
!define DEFAULT_INST_DIR "$PROGRAMFILES\${PRODUCT_GROUP}\${PRODUCT_NAME}"

!macro preInit
	SetRegView 64
	WriteRegExpandStr HKLM "${INSTALL_REGISTRY_KEY}" InstallLocation "${DEFAULT_INST_DIR}"
	WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "${DEFAULT_INST_DIR}"
	SetRegView 32
	WriteRegExpandStr HKLM "${INSTALL_REGISTRY_KEY}" InstallLocation "${DEFAULT_INST_DIR}"
	WriteRegExpandStr HKCU "${INSTALL_REGISTRY_KEY}" InstallLocation "${DEFAULT_INST_DIR}"
!macroend

!macro customInstall
  ClearErrors
  ReadRegStr $0 HKLM "SOFTWARE\Node.js" "Version"
  ${If} ${Errors}
    ${If} ${RunningX64}
      File "${BUILD_RESOURCES_DIR}\nodejs\node-v10.16.0-x64.msi"
      ExecWait "${BUILD_RESOURCES_DIR}}\nodejs\node-v10.16.0-x64.msi"
    ${Else}
      File "${BUILD_RESOURCES_DIR}\nodejs\node-v10.16.0-x86.msi"
      ExecWait "${BUILD_RESOURCES_DIR}}\nodejs\node-v10.16.0-x86.msi"
    ${EndIf}
  ${Else}
    ${If} $0 == ""
      ${If} ${RunningX64}
        File "${BUILD_RESOURCES_DIR}\nodejs\node-v10.16.0-x64.msi"
        ExecWait "${BUILD_RESOURCES_DIR}}\nodejs\node-v10.16.0-x64.msi"
      ${Else}
        File "${BUILD_RESOURCES_DIR}\nodejs\node-v10.16.0-x86.msi"
        ExecWait "${BUILD_RESOURCES_DIR}}\nodejs\node-v10.16.0-x86.msi"
      ${EndIf}
    ${EndIf}
  ${EndIf}
!macroend