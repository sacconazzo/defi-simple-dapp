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
        <ModalHeader>DeFi Demo App</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <p>Hi, here a super simple web3 joke to earn:</p>
          <br />
          <p>
            - <b>Stake</b> the amount you want. Wait a bit (depending on how
            many interact with, it could be a few minutes).
          </p>
          <br />
          <p>
            - <b>Redeem</b> your equity included <b>20% earnings</b>.
          </p>
          <br />
          <p>
            On this platform, you can always track your earnings and progress in
            real time.
          </p>
          <br />
          <p>Joke based on ponzi scheme. It's new and it works.</p>
          <br />
          <p>
            Our smart contract is deployed on the Ethereum Mainnet and other
            networks — you can view the full code at the link below.
          </p>
          <br />
          <p> Enjoy ✌️</p>
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
