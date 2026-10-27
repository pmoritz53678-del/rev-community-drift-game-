#include "REVSchoolyardSplineLibrary.h"
#include "Components/SplineComponent.h"
#include "Misc/FileHelper.h"
#include "Misc/Paths.h"

bool UREVSchoolyardSplineLibrary::LoadSchoolyardTrack(
    USplineComponent* TargetSpline,
    const FString& TrackId,
    float& OutTrackWidthCm)
{
    OutTrackWidthCm=0.0f;
    if (!IsValid(TargetSpline)) return false;

    static const TArray<FString> AllowedIds = {
        TEXT("north-pines"), TEXT("east-bowl"), TEXT("south-switch"),
        TEXT("schoolyard-gp"), TEXT("outer-express")
    };
    if (!AllowedIds.Contains(TrackId)) return false;

    const FString Filename=FPaths::Combine(FPaths::ProjectDir(),
        TEXT("Generated"), TEXT("Tracks"), TrackId+TEXT(".csv"));
    FString Csv;
    if (!FFileHelper::LoadFileToString(Csv,*Filename)) return false;

    TArray<FString> Rows;
    Csv.ParseIntoArrayLines(Rows,true);
    if (Rows.Num()<5) return false;

    TArray<FVector> Points;
    for (int32 Index=1; Index<Rows.Num(); Index++)
    {
        TArray<FString> Fields;
        Rows[Index].ParseIntoArray(Fields,TEXT(","),true);
        if (Fields.Num()!=4) return false;
        const float X=FCString::Atof(*Fields[0]);
        const float Y=FCString::Atof(*Fields[1]);
        const float Z=FCString::Atof(*Fields[2]);
        OutTrackWidthCm=FCString::Atof(*Fields[3]);
        Points.Add(FVector(X,Y,Z));
    }
    if (Points.Num()<4 || OutTrackWidthCm<100.f) return false;
    TargetSpline->ClearSplinePoints(false);
    for(const FVector& Point:Points)
    {
        TargetSpline->AddSplinePoint(Point, ESplineCoordinateSpace::Local,false);
    }
    TargetSpline->SetClosedLoop(true,false);
    TargetSpline->UpdateSpline();
    return true;
}
