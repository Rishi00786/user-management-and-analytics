import { createSlice, PayloadAction } from '@reduxjs/toolkit';


interface User {
    id: string;
    username: string;
    email: string;
    location: string;
    status: boolean;
    createdAt: string;
}

interface UserState {
    users: User[];
    allUsers: User[];
    deletedUsers: number;
    loading: boolean;
}

const initialState: UserState = {
    users: [],
    allUsers: [],
    deletedUsers: 0,
    loading: false,
};

const userSlice = createSlice({
    name: 'users',
    initialState,
    reducers: {
        setUsers(state, action: PayloadAction<User[]>) {
            state.users = action.payload;
        },
        setAllUsers(state, action: PayloadAction<User[]>) {
            state.allUsers = action.payload;
        },
        deleteUser(state, action: PayloadAction<string>) {
            state.users = state.users.filter((user) => user.id !== action.payload);
            state.allUsers = state.allUsers.filter((user) => user.id !== action.payload);
            state.deletedUsers += 1;
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
    },
});


export const { setUsers, setAllUsers, deleteUser, setLoading } = userSlice.actions;
export default userSlice.reducer;