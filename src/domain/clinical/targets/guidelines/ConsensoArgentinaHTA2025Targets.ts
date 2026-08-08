import type { ClinicalTarget } from '../ClinicalTarget'

export const ConsensoArgentinaHTA2025Targets: ClinicalTarget[] = [

{
id: 'arg-hta-2025-adults-16-79',

guidelineId: 'consenso-hta-argentina-2025',

population: 'adultos_16_79',

systolic: {
  max: 140,
},

diastolic: {
  max: 90,
},

conditions: [
  'poblacion_general',
],

priority: 0,

recommendationClass: 'I',

evidenceLevel: 'A',

description:
  'Objetivo primario de presión arterial para pacientes de 16 a 79 años.',
},


{
id: 'arg-hta-2025-adults-16-79-desirable',

guidelineId: 'consenso-hta-argentina-2025',

population: 'adultos_16_79',

systolic: {
  max: 130,
},

diastolic: {
  max: 80,
},

conditions: [
  'buena_tolerancia',
],

priority: 10,

recommendationClass: 'I',

evidenceLevel: 'A',

description:
  'Objetivo deseable si es tolerado.',
},


{
id: 'arg-hta-2025-ckd',

guidelineId: 'consenso-hta-argentina-2025',

population: 'adultos_16_79',

systolic: {
  min: 120,
  max: 129,
},

diastolic: {
  max: 80,
},

conditions: [
  'enfermedad_renal_cronica',
],

priority: 100,

recommendationClass: 'I',

evidenceLevel: 'A',

description:
  'Objetivo terapéutico para pacientes con enfermedad renal crónica cuando es tolerado.',
},



{
id: 'arg-hta-2025-diabetes',

guidelineId: 'consenso-hta-argentina-2025',

population: 'adultos_16_79',

systolic: {
  max: 130,
},

diastolic: {
  max: 80,
},

conditions: [
  'diabetes',
],

priority: 70,

recommendationClass: 'I',

evidenceLevel: 'A',

description:
  'Objetivo terapéutico para pacientes con diabetes mellitus cuando es tolerado.',
},



{
id: 'arg-hta-2025-elderly-80',

guidelineId: 'consenso-hta-argentina-2025',

population: 'mayores_80',

priority: 80,

systolic: {
  min: 140,
  max: 150,
},

diastolic: {
  max: 80,
},

recommendationClass: 'I',

evidenceLevel: 'A',

description:
  'Objetivo para pacientes mayores de 80 años.',
},

]
