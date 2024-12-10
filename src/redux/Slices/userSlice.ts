import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define the initial state and types
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

// Create a slice of state for users
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
            // Remove deleted user from the `users` array
            state.users = state.users.filter((user) => user.id !== action.payload);
            state.allUsers = state.allUsers.filter((user) => user.id !== action.payload);
            state.deletedUsers += 1; // Increment deleted users count
        },
        setLoading(state, action: PayloadAction<boolean>) {
            state.loading = action.payload;
        },
    },
});

// Export actions
export const { setUsers, setAllUsers, deleteUser, setLoading } = userSlice.actions;

// Export the reducer
export default userSlice.reducer;