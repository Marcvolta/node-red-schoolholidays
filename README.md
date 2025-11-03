# node-red-contrib-school-holidays-de

A Node-RED node to retrieve school holidays for all German federal states (Bundesländer).

This node provides easy access to school holiday information for Germany, allowing you to query current, next, or upcoming holidays, filter by state, year, and holiday type.

## Installation

Run the following command in your Node-RED user directory (typically `~/.node-red`):

```bash
npm install node-red-contrib-school-holidays-de
```

Or install directly through the Node-RED palette manager.

## Prerequisites

You will need an API key from [schulferien.app](https://www.schulferien.app) to use this node.

## Features

- Retrieve school holidays for all 16 German federal states
- Filter holidays by year and type (e.g., summer holidays, winter holidays)
- Quick access modes: current, next, or upcoming holidays
- Flexible output formats (array or object with metadata)
- Dynamic state override via incoming message
- Visual status indicators for API call states

## Usage

### Basic Configuration

1. Drag the "Schulferien DE" node from the function category into your flow
2. Double-click to configure:
   - **API Key** (required): Your API key from schulferien.app
   - **Bundesland**: Select a German state or "Alle" for all states
   - **Jahr**: Select the school year (e.g., 2024/25)
   - **Ferienart**: Select holiday type or "Alle" for all types
   - **Output Format**: Choose between array or object format

### Quick Access Mode

Enable "Nur folgende Treffer zeigen" to quickly access:

- **Aktuell**: Current holidays
- **Nächste**: Next holiday period
- **Kommende**: Upcoming holidays

### Input Message

Trigger the node by sending any message. You can override configuration values:

```javascript
msg.state = "BY"; // Override state (e.g., Bavaria)
msg.year = "2024"; // Override year
msg.type = "Sommerferien"; // Override holiday type
```

### Output Message

#### Array Format (default)

```javascript
msg.payload = [
  {
    name: "Sommerferien",
    start: "2024-07-25",
    end: "2024-09-06",
    state: "BY",
  },
  // ... more holidays
];
```

#### Object Format

```javascript
msg.payload = {
  state: "BY",
  holidays: [
    {
      name: "Sommerferien",
      start: "2024-07-25",
      end: "2024-09-06",
      state: "BY",
    },
  ],
  fetched: "2024-11-03T10:30:00.000Z",
};
```

## Supported States (Bundesländer)

| Code | State                                        |
| ---- | -------------------------------------------- |
| BW   | Baden-Württemberg                            |
| BY   | Bayern (Bavaria)                             |
| BE   | Berlin                                       |
| BB   | Brandenburg                                  |
| HB   | Bremen                                       |
| HH   | Hamburg                                      |
| HE   | Hessen (Hesse)                               |
| MV   | Mecklenburg-Vorpommern                       |
| NI   | Niedersachsen (Lower Saxony)                 |
| NW   | Nordrhein-Westfalen (North Rhine-Westphalia) |
| RP   | Rheinland-Pfalz (Rhineland-Palatinate)       |
| SL   | Saarland                                     |
| SN   | Sachsen (Saxony)                             |
| ST   | Sachsen-Anhalt (Saxony-Anhalt)               |
| SH   | Schleswig-Holstein                           |
| TH   | Thüringen (Thuringia)                        |

## Holiday Types (Ferienarten)

- **Herbstferien** - Autumn holidays
- **Weihnachtsferien** - Christmas holidays
- **Winterferien** - Winter holidays
- **Osterferien/Frühjahrsferien** - Easter/Spring holidays
- **Himmelfahrt/Pfingsten** - Ascension Day/Pentecost
- **Sommerferien** - Summer holidays

## Example Flow

```json
[
  {
    "id": "example-flow",
    "type": "school-holidays-de",
    "name": "Bayern Holidays",
    "apikey": "your-api-key",
    "state": "BY",
    "year": "2024",
    "holidayType": "all",
    "outputFormat": "array"
  }
]
```

## Use Cases

- **Home Automation**: Adjust heating/lighting schedules during school holidays
- **Calendar Integration**: Sync school holidays with personal calendars
- **Travel Planning**: Get notified about upcoming holiday periods
- **Educational Apps**: Display holiday information in school-related applications
- **Smart Home Scenes**: Activate "holiday mode" automatically

## Status Indicators

The node provides visual feedback:

- **Blue dot**: Fetching data from API
- **Green dot**: Successfully retrieved holidays
- **Red ring**: Error occurred (check debug panel)

## Error Handling

The node will display warnings for:

- Missing API key
- Missing state selection
- API connection errors
- Invalid API responses

Check the debug panel for detailed error messages.

## Requirements

- Node-RED version 1.0 or higher
- Node.js version 14.0 or higher
- Active internet connection
- Valid API key from schulferien.app

## API Information

This node uses the [schulferien.app API](https://www.schulferien.app) to retrieve holiday data. Please ensure you have a valid API key and comply with their terms of service.

## Repository

- [GitHub](https://github.com/Marcvolta/node-red-school-holidays-de)

## Author

Marco Eberlein

## License

ISC

## Changelog

### 1.0.0

- Initial release
- Support for all 16 German federal states
- Flexible filtering by year and holiday type
- Multiple output formats
- Quick access modes for current/next/upcoming holidays

## Support

For issues, questions, or contributions, please visit the [GitHub repository](https://github.com/Marcvolta/node-red-school-holidays-de/issues).

## Related Nodes

- [node-red-contrib-simple-energymeter](https://www.npmjs.com/package/node-red-contrib-simple-energymeter) - Energy meter node by the same author
