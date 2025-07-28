import React from "react";

const TriggerInput = ({
                          triggerApp,
                          showSuggestions,
                          suggestions,
                          handleTriggerAppChange,
                          handleSuggestionsClick,
                          styles,
                          imageServices,
                      }) => {
    return (
        <div>
            <input
                id="inputTrigger"
                type="text"
                style={styles.inputTrigger}
                placeholder="Search for an Action App"
                value={triggerApp}
                onChange={handleTriggerAppChange}
            />
            {showSuggestions && (
                <div style={styles.suggestionBox}>
                    {suggestions.map((suggestions, index) => (
                        <div
                            key={index}
                            style={styles.suggestionChoice}
                            onClick={() => handleSuggestionsClick(suggestions)}
                        >
                            <img
                                src={imageServices[index].image}
                                alt={`${suggestions} logo`}
                                style={{width: '20px', height: '20px', marginRight: '10px'}}
                            />
                            {suggestions}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const ActionInput = ({
                         actionApp,
                         showActionSuggestions,
                         suggestions,
                         handleActionAppChange,
                         handleActionClick,
                         styles,
                         imageServices,
                     }) => {
    return (
        <>
            <input
                type="text"
                style={styles.inputAction}
                placeholder="Search for a Trigger App"
                value={actionApp}
                onChange={handleActionAppChange}
            />
            {showActionSuggestions && (
                <div style={styles.suggestionActionBox}>
                    {suggestions.map((suggestions, index) => (
                        <div
                            key={index}
                            style={styles.suggestionChoice}
                            onClick={() => handleActionClick(suggestions)}
                        >
                            <img
                                src={imageServices[index].image}
                                alt={`${suggestions} logo`}
                                style={{width: '20px', height: '20px', marginRight: '10px'}}
                            />
                            {suggestions}
                        </div>
                    ))}
                </div>
            )}
        </>
    );
};

export { TriggerInput, ActionInput };