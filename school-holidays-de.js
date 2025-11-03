module.exports = function (RED) {
  const http = require("http");
  const https = require("https");

  function SchoolHolidaysDeNode(config) {
    RED.nodes.createNode(this, config);
    var node = this;
    var mParams = new Map();

    const host = "www.schulferien.app";
    const port = 443;

    // Store configuration
    node.apikey = config.apikey || "";
    node.state = config.state || "";
    node.year = config.year || "";
    node.holidayType = config.holidayType || "";
    node.outputFormat = config.outputFormat || "array";
    node.buttonEnabled = config.buttonEnabled || false;
    node.holidaySelectionMode = config.holidaySelectionMode || "array";

    node.on("input", function (msg, send, done) {
      // For Node-RED 0.x compatibility
      send =
        send ||
        function () {
          node.send.apply(node, arguments);
        };
      done =
        done ||
        function (err) {
          if (err) node.error(err, msg);
        };

      try {
        // Get state from config or msg
        var apikey = node.apikey;
        var state = msg.state || node.state;
        var year = msg.year || node.year;
        var type = msg.holidayType || node.holidayType;
        var buttonEnabled = msg.buttonEnabled || node.buttonEnabled;
        var holidaySelectionMode =
          msg.holidaySelectionMode || node.holidaySelectionMode;

        var apiURL = "/api/v1/schulferien";

        mParams.set("apikey", apikey);
        mParams.set("state", state);
        mParams.set("year", year);
        mParams.set("type", type);
        mParams.set("buttonEnabled", buttonEnabled);
        mParams.set("holidaySelectionMode", holidaySelectionMode);

        if (!state) {
          node.warn("No state specified. Please configure a German state.");
          done();
          return;
        }

        for (const [key, val] of mParams.entries()) {
          if (!buttonEnabled && !val) {
            if (key !== "buttonEnabled") {
              var keyName = `${key}`;
              node.warn("No " + keyName + " specified. Please select one.");
              done();
              return;
            }
          }
        }

        // Call API to retrieve school holidays
        node.status({ fill: "blue", shape: "dot", text: "fetching..." });

        // Build query string from parameters
        const queryParams = new URLSearchParams();

        queryParams.append("apikey", apikey);
        queryParams.append("state", state);

        if (buttonEnabled) {
          apiURL += "" + "/" + mParams.get("holidaySelectionMode") + "?";
        } else {
          apiURL += "?";
          if (year) queryParams.append("year", year);
          if (type && type !== "all") queryParams.append("type", type);
        }

        const options = {
          hostname: host,
          port: port,
          path: apiURL + `${queryParams.toString()}`,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": mParams.get("apikey"),
          },
        };

        const req = https.request(options, (res) => {
          let data = "";

          res.on("data", (chunk) => {
            data += chunk;
          });

          res.on("end", () => {
            try {
              if (res.statusCode !== 200) {
                node.status({
                  fill: "red",
                  shape: "ring",
                  text: `error: ${res.statusCode}`,
                });
                done(
                  new Error(`API returned status ${res.statusCode}: ${data}`)
                );
                return;
              }

              const holidays = JSON.parse(data);

              // Set output based on format
              if (node.outputFormat === "array") {
                msg.payload = holidays;
              } else {
                msg.payload = {
                  state: state,
                  holidays: holidays,
                  fetched: new Date().toISOString(),
                };
              }

              node.status({ fill: "green", shape: "dot", text: "success" });
              send(msg);
              done();
            } catch (parseError) {
              node.status({ fill: "red", shape: "ring", text: "parse error" });
              done(parseError);
            }
          });
        });

        req.on("error", (error) => {
          node.status({ fill: "red", shape: "ring", text: "error" });
          done(error);
        });

        req.end();
      } catch (err) {
        node.status({ fill: "red", shape: "ring", text: "error" });
        done(err);
      }
    });

    node.on("close", function () {
      node.status({});
    });
  }

  RED.nodes.registerType("school-holidays-de", SchoolHolidaysDeNode);
};
