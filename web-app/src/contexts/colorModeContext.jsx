// import React from 'react';

// const ColorModeContext = React.createContext({ toggleColorMode: () => {}, mode: 'light' });

// export default function ColorModeProvider({ children }) {
//     const [mode, setMode] = React.useState('light');

//     const toggleColorMode = React.useCallback(() => {
//         setMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
//     }, []);

//     console.log("Current mode:",mode)
//     return (
//         <ColorModeContext.Provider value={{ mode, toggleColorMode }}>
//             {children}
//         </ColorModeContext.Provider>
//     );
// }

// export const useColorMode = () => {
//     return React.useContext(ColorModeContext);
// };


import React from 'react';

const ColorModeContext = React.createContext({ toggleColorMode: () => {}, mode: 'light' });

export default function ColorModeProvider({ children }) {
    const [mode, setMode] = React.useState(() => {
        const savedMode = localStorage.getItem('colorMode');
        return savedMode ? savedMode : 'light';
    });

    const toggleColorMode = React.useCallback(() => {
        setMode((prevMode) => {
            const newMode = (prevMode === 'light' ? 'dark' : 'light');
            localStorage.setItem('colorMode', newMode);
            return newMode;
        });
    }, []);
    
    return (
        <ColorModeContext.Provider value={{ mode, toggleColorMode }}>
            {children}
        </ColorModeContext.Provider>
    );
}

export const useColorMode = () => {
    return React.useContext(ColorModeContext);
};
