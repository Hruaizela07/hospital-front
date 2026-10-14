import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { test } from 'node:test'

const PATIENT_ID_SELECT_ITEM = /<SelectItem key=\{patient\.id\} value=\{patient\.id\}>/
const PATIENT_NAME_SYMPTOM_LABEL = /label: `\$\{patient\.name\} Symptom: \$\{patient\.symptom \?\? 'No symptom'\}`/
const PATIENT_LABEL_SELECT_ITEM = /value=\{`\$\{patient\.name\}/
const DOCTOR_SEARCH_STATE = /const \[doctorSearch, setDoctorSearch\] = useState\(''\)/
const DOCTOR_POPOVER_STATE = /const \[doctorPopoverOpen, setDoctorPopoverOpen\] = useState\(false\)/
const DOCTOR_SEARCH_INPUT = /placeholder="Search doctors"/
const DOCTOR_SEARCH_IN_POPOVER_CONTENT = /<PopoverContent[\s\S]*?<Input[\s\S]*?placeholder="Search doctors"/
const DOCTOR_PICKER_DISABLED_BY_ALL_OPTIONS = /disabled=\{busy \|\| doctors\.loading \|\| !doctorOptions\.length\}/
const DOCTOR_SEARCH_FIELDS = /matchesSearch\(doctorSearch, \[doctor\.userName, doctor\.department\?\.name\]\)/
const FILTERED_DOCTOR_SELECT_ITEMS = /filteredDoctorOptions\.map\(doctor =>/
const DOCTOR_SEARCH_IN_SELECT_CONTENT = /<SelectContent>\s*<div className="p-2">\s*<Input[\s\S]*?placeholder="Search doctors"/

test('appointment add submits the patient id from the selected patient option', async () => {
  const source = await readFile('app/routes/_admin.appointments/appointment-add.tsx', 'utf8')

  assert.match(source, PATIENT_ID_SELECT_ITEM)
  assert.match(source, PATIENT_NAME_SYMPTOM_LABEL)
  assert.doesNotMatch(source, PATIENT_LABEL_SELECT_ITEM)
})

test('appointment add filters doctors by name and department', async () => {
  const source = await readFile('app/routes/_admin.appointments/appointment-add.tsx', 'utf8')

  assert.match(source, DOCTOR_SEARCH_STATE)
  assert.match(source, DOCTOR_POPOVER_STATE)
  assert.match(source, DOCTOR_SEARCH_INPUT)
  assert.match(source, DOCTOR_SEARCH_IN_POPOVER_CONTENT)
  assert.match(source, DOCTOR_PICKER_DISABLED_BY_ALL_OPTIONS)
  assert.match(source, DOCTOR_SEARCH_FIELDS)
  assert.match(source, FILTERED_DOCTOR_SELECT_ITEMS)
  assert.doesNotMatch(source, DOCTOR_SEARCH_IN_SELECT_CONTENT)
})
