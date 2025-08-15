import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalFooter,
  ModalBody,
} from '@chakra-ui/react';

export default function Info(props) {
  return (
    <Modal onClose={props.onClose} isOpen={props.isOpen} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>✨ Joke to 🚀 Earn</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <p>Turn your crypto into instant earnings with just a few clicks:</p>
          <br />
          <p>
            - <b>Stake</b> any amount — no minimum, no hassle. Start with just a
            small amount and see the rewards in action.
          </p>
          <br />
          <p>
            - <b>Redeem</b> anytime with <b>+20% earnings</b>.
          </p>
          <br />
          <p>
            Track your rewards <b>live, on-chain</b>, in real time.
          </p>
          <br />
          <p>
            Our audited smart contracts run on <b>Ethereum Mainnet</b> and
            multiple other top networks, giving you speed, transparency, and
            cross-chain flexibility.
          </p>
          <br />
          <p>
            <b>Why wait?</b> Start staking now and watch your balance grow.
          </p>
          <br />
          <p>🔗 View the smart contract code on-chain at the links below.</p>
        </ModalBody>
        <ModalFooter>
          <p>
            <i>coinio–05.08.25</i>
          </p>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
