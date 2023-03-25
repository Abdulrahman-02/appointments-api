export interface Appointment {
    id: string;
    type: string;
    date: Date;
    donorFirstName: string;
    donorLastName: string;
    donorDOB: Date;
    donorEmail: string;
    donorMobile: string;
    hospitalId: string;
    userId: string;
}