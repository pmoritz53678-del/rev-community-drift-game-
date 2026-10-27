using UnrealBuildTool;
public class REVDriftTarget : TargetRules {
    public REVDriftTarget(TargetInfo Target) : base(Target) {
        Type = TargetType.Game;
        DefaultBuildSettings = BuildSettingsVersion.V5;
        ExtraModuleNames.Add("REVDrift");
    }
}
