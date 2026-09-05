import { useLingui } from '@lingui/react/macro';
import { useEffect, useState } from 'react';

import { currentWorkspaceMemberState } from '@/auth/states/currentWorkspaceMemberState';
import { useUpdateOneRecord } from '@/object-record/hooks/useUpdateOneRecord';
import { useSnackBar } from '@/ui/feedback/snack-bar-manager/hooks/useSnackBar';
import { useAtomStateValue } from '@/ui/utilities/state/jotai/hooks/useAtomStateValue';
import { Button } from 'twenty-ui/input';
import { H2Title } from 'twenty-ui/typography';
import { logError } from '~/utils/logError';

// Публичная половина VAPID-пары; приватная лежит в /opt/leads_sync/vapid на сервере CRM.
const VAPID_PUBLIC_KEY =
  'BE3mFa06-B1iy1o9Gm7-Knxkbr_b9rY_kjYaZpmLTu6keSav16Z8WP6We_-HtrLsovN1PH7Cn-ZOv6xS6_zNhUk';
const SERVICE_WORKER_URL = '/push-sw.js';

type PushStatus = 'loading' | 'unsupported' | 'denied' | 'enabled' | 'disabled';

const urlBase64ToUint8Array = (base64String: string) => {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  const output = new Uint8Array(new ArrayBuffer(rawData.length));
  for (let i = 0; i < rawData.length; i += 1) {
    output[i] = rawData.charCodeAt(i);
  }
  return output;
};

const isPushSupported = () =>
  'serviceWorker' in navigator && 'PushManager' in window && 'Notification' in window;

const getCurrentSubscription = async () => {
  const registration =
    await navigator.serviceWorker.getRegistration(SERVICE_WORKER_URL);
  return (await registration?.pushManager.getSubscription()) ?? null;
};

export const BrowserPushSection = () => {
  const { t } = useLingui();
  const currentWorkspaceMember = useAtomStateValue(currentWorkspaceMemberState);
  const { updateOneRecord } = useUpdateOneRecord();
  const { enqueueSuccessSnackBar, enqueueErrorSnackBar } = useSnackBar();
  const [status, setStatus] = useState<PushStatus>('loading');

  useEffect(() => {
    const detect = async () => {
      if (!isPushSupported()) {
        setStatus('unsupported');
        return;
      }
      if (Notification.permission === 'denied') {
        setStatus('denied');
        return;
      }
      setStatus((await getCurrentSubscription()) ? 'enabled' : 'disabled');
    };
    detect().catch((error) => {
      logError(error);
      setStatus('unsupported');
    });
  }, []);

  const saveSubscription = async (value: string | null) => {
    if (!currentWorkspaceMember?.id) {
      throw new Error('User is not logged in');
    }
    await updateOneRecord({
      objectNameSingular: 'workspaceMember',
      idToUpdate: currentWorkspaceMember.id,
      updateOneRecordInput: { browserPushSubscription: value },
    });
  };

  const handleEnable = async () => {
    try {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        setStatus(permission === 'denied' ? 'denied' : 'disabled');
        return;
      }
      const registration =
        await navigator.serviceWorker.register(SERVICE_WORKER_URL);
      await navigator.serviceWorker.ready;
      const subscription =
        (await registration.pushManager.getSubscription()) ??
        (await registration.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
        }));
      await saveSubscription(JSON.stringify(subscription.toJSON()));
      setStatus('enabled');
      enqueueSuccessSnackBar({
        message: t`Уведомления в браузере включены на этом устройстве`,
      });
    } catch (error) {
      logError(error);
      enqueueErrorSnackBar({
        message: t`Не удалось включить уведомления в браузере`,
      });
    }
  };

  const handleDisable = async () => {
    try {
      const subscription = await getCurrentSubscription();
      await subscription?.unsubscribe();
      await saveSubscription(null);
      setStatus('disabled');
      enqueueSuccessSnackBar({ message: t`Уведомления в браузере выключены` });
    } catch (error) {
      logError(error);
      enqueueErrorSnackBar({
        message: t`Не удалось выключить уведомления в браузере`,
      });
    }
  };

  const description =
    status === 'unsupported'
      ? t`Этот браузер не поддерживает push-уведомления`
      : status === 'denied'
        ? t`Уведомления запрещены в настройках браузера для этого сайта — разрешите их и обновите страницу`
        : status === 'enabled'
          ? t`Всплывающее окно о новом лиде будет приходить на это устройство, даже если CRM закрыта`
          : t`Получать всплывающее окно о каждом новом лиде на этом устройстве, даже если CRM закрыта`;

  return (
    <>
      <H2Title title={t`Уведомления в браузере`} description={description} />
      {status === 'enabled' && (
        <Button
          onClick={handleDisable}
          variant="secondary"
          title={t`Выключить на этом устройстве`}
        />
      )}
      {status === 'disabled' && (
        <Button
          onClick={handleEnable}
          variant="primary"
          accent="blue"
          title={t`Включить уведомления`}
        />
      )}
    </>
  );
};
