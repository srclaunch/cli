import fs from 'fs-extra';
import path from 'node:path';

import { constructAppLabModelExports } from '../exports.js';
import {
  getDocumentModel,
  getInvoiceModel,
  getMessageModel,
  getOrganizationModel,
  getPaymentMethodModel,
  getPaymentModel,
  getPersonModel,
  getSubscriptionModel,
  getTeamModel,
  getUserGroupModel,
  getUserModel,
  getUserRoleModel,
} from './models.js';

export async function copyStubModels() {
  try {
    const APPLAB_DIRECTORY = '.applab';
    const BUILD_PATH = path.join(
      path.resolve(),
      APPLAB_DIRECTORY,
      'dependencies/models',
    );

    const applabModelPath = path.join(BUILD_PATH, 'src');

    // await fs.writeFile(
    //   path.join(applabModelPath, 'Message.ts'),
    //   getMessageModel(),
    //   'utf8',
    // );

    await fs.writeFile(
      path.join(applabModelPath, 'Organization.ts'),
      getOrganizationModel(),
      'utf8',
    );

    await fs.writeFile(
      path.join(applabModelPath, 'Team.ts'),
      getTeamModel(),
      'utf8',
    );

    await fs.writeFile(
      path.join(applabModelPath, 'Document.ts'),
      getDocumentModel(),
      'utf8',
    );

    await fs.writeFile(
      path.join(applabModelPath, 'Payment.ts'),
      getPaymentModel(),
      'utf8',
    );

    await fs.writeFile(
      path.join(applabModelPath, 'Invoice.ts'),
      getInvoiceModel(),
      'utf8',
    );

    await fs.writeFile(
      path.join(applabModelPath, 'PaymentMethod.ts'),
      getPaymentMethodModel(),
      'utf8',
    );

    await fs.writeFile(
      path.join(applabModelPath, 'Person.ts'),
      getPersonModel(),
      'utf8',
    );

    await fs.writeFile(
      path.join(applabModelPath, 'Subscription.ts'),
      getSubscriptionModel(),
      'utf8',
    );

    await fs.writeFile(
      path.join(applabModelPath, 'User.ts'),
      getUserModel(),
      'utf8',
    );
    await fs.writeFile(
      path.join(applabModelPath, 'UserGroup.ts'),
      getUserGroupModel(),
      'utf8',
    );
    await fs.writeFile(
      path.join(applabModelPath, 'UserRole.ts'),
      getUserRoleModel(),
      'utf8',
    );

    // const modelExportsIndexFile = await constructAppLabModelExports();
    // await fs.writeFile(
    //   path.join(BUILD_PATH, 'src', 'index.ts'),
    //   modelExportsIndexFile,
    //   'utf8',
    // );
  } catch (error: any) {
    console.error(error);
  }
}
