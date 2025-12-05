# # messaging/services/jasmin.py

# import logging
# import smpplib.client
# import smpplib.consts
# import smpplib.gsm

# from django.conf import settings

# logger = logging.getLogger(__name__)

# JASMIN_SMPP_HOST = getattr(settings, "JASMIN_SMPP_HOST", "telnet localhost")
# JASMIN_SMPP_PORT = getattr(settings, "JASMIN_SMPP_PORT", 8990)
# JASMIN_SMPP_USERNAME = getattr(settings, "JASMIN_SMPP_USERNAME", "jcliadmin")
# JASMIN_SMPP_PASSWORD = getattr(settings, "JASMIN_SMPP_PASSWORD", "jclipwd")


# def _build_smpp_client():
#     client = smpplib.client.Client(JASMIN_SMPP_HOST, JASMIN_SMPP_PORT)
#     client.connect()
#     client.bind_transceiver(
#         system_id=JASMIN_SMPP_USERNAME,
#         password=JASMIN_SMPP_PASSWORD,
#     )
#     return client


# def send_sms_via_jasmin(sender: str, recipient: str, message_text: str) -> str:
#     """
#     Connects to Jasmin over SMPP, submits an SMS,
#     and returns the SMPP message_id returned by Jasmin.
#     """
#     client = _build_smpp_client()

#     # If needed, split long message into parts using smpplib.gsm.make_parts
#     parts, encoding_flag, msg_type_flag = smpplib.gsm.make_parts(message_text)

#     message_id = None

#     for part in parts:
#         pdu = client.send_message(
#             source_addr_ton=smpplib.consts.SMPP_TON_ALPHANUMERIC,
#             source_addr_npi=smpplib.consts.SMPP_NPI_UNKNOWN,
#             source_addr=sender[:11],  # Alphanumeric sender ID is max 11 chars

#             dest_addr_ton=smpplib.consts.SMPP_TON_INTERNATIONAL,
#             dest_addr_npi=smpplib.consts.SMPP_NPI_E164,
#             destination_addr=recipient,

#             short_message=part,
#             data_coding=encoding_flag,
#             esm_class=msg_type_flag,
#         )
#         message_id = pdu.message_id  # last part's id (often same for all parts)
#         logger.info(f"Sent SMS to {recipient} via SMPP, message_id={message_id}")

#     client.unbind()
#     client.disconnect()

#     return message_id or ""
# messaging/services/jasmin.py

import logging
import smpplib.client
import smpplib.consts
import smpplib.gsm

from django.conf import settings

logger = logging.getLogger(__name__)

# ALWAYS read from Django settings
JASMIN_SMPP_HOST = settings.JASMIN_SMPP_HOST
JASMIN_SMPP_PORT = settings.JASMIN_SMPP_PORT
JASMIN_SMPP_USERNAME = settings.JASMIN_SMPP_USERNAME
JASMIN_SMPP_PASSWORD = settings.JASMIN_SMPP_PASSWORD


def _build_smpp_client():
    client = smpplib.client.Client(JASMIN_SMPP_HOST, JASMIN_SMPP_PORT)
    client.connect()
    client.bind_transceiver(
        system_id=JASMIN_SMPP_USERNAME,
        password=JASMIN_SMPP_PASSWORD,
    )
    return client


def send_sms_via_jasmin(sender: str, recipient: str, message_text: str) -> str:
    client = _build_smpp_client()

    parts, encoding_flag, msg_type_flag = smpplib.gsm.make_parts(message_text)

    message_id = None

    for part in parts:
        pdu = client.send_message(
            source_addr_ton=smpplib.consts.SMPP_TON_ALPHANUMERIC,
            source_addr_npi=smpplib.consts.SMPP_NPI_UNKNOWN,
            source_addr=sender[:11],
            dest_addr_ton=smpplib.consts.SMPP_TON_INTERNATIONAL,
            dest_addr_npi=smpplib.consts.SMPP_NPI_E164,
            destination_addr=recipient,
            short_message=part,
            data_coding=encoding_flag,
            esm_class=msg_type_flag,
        )
        message_id = pdu.message_id
        logger.info(f"Sent SMS to {recipient} via SMPP, message_id={message_id}")

    client.unbind()
    client.disconnect()

    return message_id or ""

