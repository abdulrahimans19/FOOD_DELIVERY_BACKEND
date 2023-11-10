export function htmlContent(raffle_id, date, number) {
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
        <title>Green Certificate</title>
        <style>
            /* Define your CSS styles here */
            body {
                font-family: Arial, sans-serif;
            }
            h1 {
                color: green;
            }
            /* Add more styles as needed */
        </style>
    </head>
    <body>
        <h1>Congratulations!</h1>
        <p>You've won the Green Certificate in Raffle ID: ${raffle_id}</p>
        <p>Date: ${date}</p>
        <p>Certificate Number: ${number}</p> 
    </body>
    </html>
`;
  return htmlContent;
}
