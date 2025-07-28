import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import Zap from '../src/Component/Zap';

test('App Displaying Zap', () => {
    const mockZapList = {
        // Mock zapList data
    };
    const mockSetZapList = jest.fn();
    const mockAppImage = {
        // Mock appImage data
    };
    const mockSuggestions = 'Suggestions'; // Mock suggestions

    const { getByText, getByAltText, getByTestId } = render(
        <Zap
            styles={{}} // Mock styles data
            zapList={mockZapList}
            setZapList={mockSetZapList}
            appImage={mockAppImage}
            suggestions={mockSuggestions}
        />
    );

    // Vous pouvez maintenant utiliser les fonctions getByText, getByAltText, et getByTestId pour rechercher des éléments dans le composant Zap et effectuer des assertions.
    const triggerAppImage = getByAltText(`${mockSuggestions} logo`);
    const deleteButton = getByText('Delete');

    // Effectuez des assertions comme suit.
    expect(triggerAppImage).toBeTruthy();
    expect(deleteButton).toBeTruthy();
});
