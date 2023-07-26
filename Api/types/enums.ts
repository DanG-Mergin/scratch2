enum MsgType {
    data = "data",
    state = "state",
    index = "index",
}

enum MsgAction {
    create = "create",
    read = "read",
    update = "update",
    delete = "delete",
    search = "search",
}

enum MsgStatus {
    loading = 'loading', // The query is in the process of being fetched from the API.
    error = 'error', // An error occurred while trying to fetch the data from the API.
    success = 'success', // The query has been successfully fetched and the data is available.
    idle = 'idle', // The query has not been executed yet.
    pending = 'pending', // Pushing data/changes to the API.
}

enum MsgTask {
    deid = 'deid',
    drug = "drug",
}
enum MsgEntity {
    annotation = 'annotation',
    doc = 'doc',
    label = 'label',
    entity = 'entity',
    token = 'token',
    substitution = 'substitution',
}

enum MsgEntityType {
    ner = 'ner',
    deid = 'deid',
    drug = 'drug',
    dictionary = 'dictionary',
}

enum PatientClass {
    inpatient = "inpatient",
    outpatient = "outpatient",
    emergency = "emergency",
    newborn = "newborn",
    maternity = "maternity",
    other = "other",
    preadmision = "preadmision",
}

enum DocType {
    discharge_notes = "discharge_notes",
    discharge_summary = "discharge_notes",
    progress_notes = "progress_notes",
    progress_note = "progress_notes",
}

export { MsgEntity, MsgEntityType, MsgType, MsgAction, MsgStatus, MsgTask, DocType, PatientClass };