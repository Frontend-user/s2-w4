export const changeIdFormat = (obj: any) => {
    obj.id = obj._id
    delete obj._id
    return obj
}