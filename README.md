# Lucky Draw Frontend

A minimal frontend to test the Lucky Draw Backend. 
Live URL: http://luckydrawapi.s3-website.ap-south-1.amazonaws.com/

## Setup
1. Clone the repo
`git clone https://github.com/ayushjainrksh/lucky-draw-frontend.git`
2. Install dependencies
`npm install`
3. Start the application
`npm start`
4. Visit `http://localhost:3000`

## Usage/Functionality

1. Select a user by clicking on any one of the userId being displayed.
2. Click `Get ticket` to generate a new raffle ticket. You can generate as much tickets as you want. The current ticket would be shown in the TicketId.
3. Create an event by entering name, schedule and prizes.
4. You can see the latest upcoming event in the upcoming events section.
5. Click on the `enter` button to enter an event ( with the given ticketId ). A user can enter an event only once and a ticket can also by used only once. It would throw an error if you try to do any of these things.
6. Once the scheduled time of the event is reached, the winner is announced.
7. You can check the winners of all the events of the last 1 week.

