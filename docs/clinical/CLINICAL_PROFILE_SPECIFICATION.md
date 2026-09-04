# Clinical Profile Specification

## Purpose

The CardioSync Profile provides optional patient-level information used to construct ClinicalContext.

The Profile does not replace blood pressure measurements and does not become part of BloodPressureRecord.

CardioSync remains focused on:

- registering blood pressure measurements;
- visualizing measurements;
- understanding blood pressure evolution.

## Architecture

Configuration -> Profile -> Clinical Profile Data -> ClinicalContext -> Clinical Analysis -> ClinicalAnalysisResult

Clinical Analysis may operate without Profile data.

No Profile:
BloodPressureRecord[] + StatisticsSummary -> Clinical Analysis

With Profile:
Profile -> ClinicalContext -> Clinical Analysis

## Profile data

### Demographic

- age: number
- sex: male | female

### Anthropometric

- height: number
- weight: number
- bmi: number

BMI may later be derived from height and weight.

### Cardiovascular risk factors

- smoking: boolean
- diabetes: boolean
- dyslipidemia: boolean
- obesity: boolean
- familyHistoryCardiovascularDisease: boolean

### Cardiovascular conditions

- cardiovascularDisease: boolean
- heartFailure: boolean
- strokeHistory: boolean
- peripheralVascularDisease: boolean

### Renal conditions

- chronicKidneyDisease: boolean

### Special populations

- pregnancy: boolean
- olderAdult: boolean

olderAdult may later be derived from age.

### Lifestyle

- physicalActivityLevel: string
- alcoholConsumption: string
- dietaryPattern: string

### Additional

- notes: string

## Data outside Profile

The following remain measurement-level data in BloodPressureRecord:

- systolic
- diastolic
- dateTime
- heartRate
- arm
- position
- measurement notes
- other values describing that specific measurement

Profile data must not be copied into every BloodPressureRecord.

## ClinicalContext responsibilities

ClinicalContext represents patient-level information available to Clinical Analysis.

It may contain:

- demographic context;
- cardiovascular risk factors;
- cardiovascular conditions;
- renal conditions;
- special populations;
- lifestyle context.

It does not:

- calculate statistics;
- store blood pressure measurements;
- generate findings;
- select the analysis period;
- export reports.

## Statistics

The Profile does not own the analysis period.

Periods belong to the Statistics or analysis workflow:

- 7 days
- 30 days
- 90 days
- custom

Clinical Analysis receives the resulting StatisticsSummary and ClinicalContext.

Clinical Analysis does not directly depend on PeriodFilter.

## Reports

Reports may later consume:

- selected-period measurements;
- StatisticsSummary;
- ClinicalAnalysisResult;
- relevant Profile/ClinicalContext information;
- available Health Connect information.

The Profile does not define report contents.

## Health Connect

Health Connect will be treated as another data source.

The Clinical Engine must remain independent of the origin of the data.

Possible sources:

- Manual
- Health Connect
- Future imports

The domain representation remains independent from the source.

## Implementation status

Completed:

- ClinicalContext consolidated under src/domain/clinical/models/ClinicalContext.ts
- historical duplicate Profile model removed
- historical duplicate ClinicalContext model removed
- TypeScript compilation verified

Not implemented yet:

- Profile UI
- Profile persistence
- ClinicalContext persistence
- production integration of Profile with Clinical Analysis

## Design constraints

Do not:

- add clinical fields to BloodPressureRecord;
- create duplicate ClinicalContext models;
- make Clinical Analysis depend on UI components;
- make Clinical Analysis depend directly on PeriodFilter;
- automatically generate findings from Profile fields;
- introduce diagnostic functionality;
- introduce treatment recommendations;
- introduce complex cardiovascular risk models without a separate specification.

CardioSync remains focused on registration, visualization, and understanding of blood pressure evolution.
