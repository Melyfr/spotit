export interface IPosition {
   lat: number
   lng: number 
}

export interface ITag {
    title: string
 }

 export interface IPointData {
    id: number
    title: string
    position: IPosition
    tags: ITag[]
    adr: string
    date: string
    img: string
    authorID: number | string
 }

export default interface IPoint {
    [id: number]: IPointData
}