// Copyright (c) Microsoft Corporation.
// Licensed under the MIT License.

import { Component, OnInit } from '@angular/core';
import { IDashboardEmbedConfiguration, models, service } from 'powerbi-client';
import { HttpService } from 'src/app/services/httpservice.service';
import { ConfigResponse } from 'src/interfaces';

@Component({
  selector: 'dashboard-embed',
  templateUrl: './dashboard-embed.component.html',
  styleUrls: ['./dashboard-embed.component.css'],
})
export class DashboardEmbedComponent implements OnInit {
  // Overall status message of embedding
  displayMessage =
    'The dashboard is bootstrapped. Click Embed Dashboard button to set the access token.';

  // CSS Class to be passed to the wrapper
  dashboardClass = 'dashboard-container';

  // Pass the basic embed configurations to the wrapper to bootstrap the dashboard on first load
  // Values for properties like embedUrl and accessToken click of button
  dashboardConfig: IDashboardEmbedConfiguration = {
    type: 'dashboard',
    embedUrl: undefined,
    tokenType: models.TokenType.Embed,
    accessToken: undefined,
  };

  // Map of event handlers to be applied to the embedding report
  eventHandlersMap = new Map([
    [
      'loaded',
      () => {
        this.displayMessage = 'Dashboard has loaded';
        console.log('Dashboard has loaded');
      },
    ],
    [
      'rendered',
      () => {
        console.log('Dashoard has rendered');

        // Update display message
        this.displayMessage = 'The dashboard is rendered';
        this.displayMessage = 'The dashboard is rendered';
      },
    ],
    [
      'error',
      (event?: service.ICustomEvent<any>) => {
        if (event) {
          console.error(event.detail);
        }
      },
    ],
    [
      'errorEvent',
      () => {
        this.displayMessage = 'Test error';
        console.log('Test error');
      },
    ],
    [
      'visualClicked',
      () => {
        this.displayMessage = 'Visual Clicked';
        console.log('visual clicked');
      },
    ],
  ]);

  constructor(public httpService: HttpService) { }

  ngOnInit(): void { }

  /**
   * Embeds the dashboard
   *
   * @returns Promise<void>
   */
  async embedDashboard(): Promise<void> {
    // API Endpoint to get the dashboard embed config
    const dashboardUrl =
      'https://playgroundbe-bck-1.azurewebsites.net/Dashboards/SampleDashboard';

    let dashboardConfigResponse: ConfigResponse;

    // Get the embed config from the service and set the dashboardConfigResponse
    try {
      dashboardConfigResponse = await this.httpService
        .getEmbedConfig(dashboardUrl)
        .toPromise();
    } catch (error) {
      console.error(
        `Failed to fetch config for dashboard. Status: ${error.statusText} Status Code: ${error.status}`
      );
      return;
    }

    // Update the dashboardConfig to embed the PowerBI dashboard
    this.dashboardConfig = {
      ...this.dashboardConfig,
      id: dashboardConfigResponse.Id,
      embedUrl: dashboardConfigResponse.EmbedUrl,
      accessToken: dashboardConfigResponse.EmbedToken.Token,
    };

    this.displayMessage = 'Access token is successfully set. Loading Power BI dashboard.';
  }

  /**
   * Update event handlers for the Report object
   * Set event handler to null if event needs to be removed
   */
  updateEvents() {
    this.eventHandlersMap = new Map([
      ['visualClicked', null],
      [
        'dataSelected',
        () => {
          console.log('Data selected');
        },
      ],
    ]);
  }
}
