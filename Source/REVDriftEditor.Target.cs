using UnrealBuildTool;
public class REVDriftEditorTarget : TargetRules {
    public REVDriftEditorTarget(TargetInfo Target) : base(Target) {
        Type = TargetType.Editor;
        DefaultBuildSettings = BuildSettingsVersion.V5;
        ExtraModuleNames.Add("REVDrift");
    }
}
