// types from server

/*

{
    "ID": 1,
    "CreatedAt": "2026-02-16T23:22:59.804761Z",
    "UpdatedAt": "2026-02-16T23:22:59.804761Z",
    "DeletedAt": null,
    "Title": "Title",
    "Description": "test",
    "Status": "todo",
    "DueDate": "2026-02-16T23:22:59Z"
  },

*/

export interface Task {
  ID: number;
  CreatedAt: string;
  UpdatedAt: string;
  DeletedAt: string | null;
  Title: string;
  Description: string;
  Status: string;
  DueDate: string; // ISO format
}
