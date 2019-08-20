
// Function to make buttons look nice and do pretty things :) 

export function prettyButton(button){

    
    const bgColor = button.style.backgroundColor;

    button.addEventListener('mouseenter', e => {
        button.style.backgroundColor = '#0079D3';
        button.style.color = 'white';
    });

    button.addEventListener('mouseleave', e => {
        button.style.color = '#0079D3';
        button.style.background = bgColor;
    });
}

export default prettyButton;