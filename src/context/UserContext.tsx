import { createContext, useEffect, useCallback, useState } from 'react';
import apiClient from '../api/client';
import { User } from '../types/User';

type UserContextType = {
    user: User | null;
    isLoading: boolean;
    error: string | null;
    refreshUser: () => Promise<void>;
};

const UserContext = createContext<UserContextType>({
    user: null,
    isLoading: false,
    error: null,
    refreshUser: async () => { },
});

export const UserProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchUser = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await apiClient.get<User>('/user/me');
            setUser(response.data);
        } catch (err) {
            if (err instanceof Error) {
                setError(err.message);
            } else if (typeof err === 'string') {
                setError(err);
            } else {
                setError('An unknown error occurred');
            }
        }
        setIsLoading(false);
    }, []);


    useEffect(() => {
        fetchUser();
    }, [fetchUser]);

    const refreshUser = useCallback(async () => {
        await fetchUser();
    }, [fetchUser]);

    return (
        <UserContext.Provider value={{ user, isLoading, error, refreshUser }}>
            {children}
        </UserContext.Provider>
    );
}

