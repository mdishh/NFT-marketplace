import { useState } from 'react'
import { ethers } from "ethers"
import { Row, Form, Button } from 'react-bootstrap'
import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router';
import pinataSDK from '@pinata/sdk';

const Create = ({ marketplace, nft }) => {
  const [image, setImage] = useState('')
  const [price, setPrice] = useState(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [error,setError]=useState('');
  const nav=useNavigate();
  const pinata = new pinataSDK({ pinataJWTKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI3YjM3N2I0Mi05ZTljLTRiOTUtYTJiZi05YmVmMDNkNTU5YTQiLCJlbWFpbCI6Im1kNDg5MzM4MUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMTJiMjk4NDlkODc4YmYwZmY1NjIiLCJzY29wZWRLZXlTZWNyZXQiOiI3NjUxYTY3NzJlZTVkMmYwN2MwZmViMThkOGI1MWEyM2NkMTFiOWE2NjEzNWE3MTA2NzY3OGExM2NmYmI0MjBiIiwiaWF0IjoxNzE0MTAyNTE1fQ._aikZmmY6tKCaKHZwsr8XKWOyD6hxhz-bZ2S0l8M7Dw'});

  const uploadToIPFS = async (event) => {
    console.log("inside upload");
    event.preventDefault()
    const file = event.target.files[0]
    if (typeof file !== 'undefined') {
      try {
        const formData=new FormData();
        formData.append("file",file);
        console.log(formData);
        const response=await axios({
          method:"post",
          url:"https://api.pinata.cloud/pinning/pinFileToIPFS",
          data: formData,
          headers:{
            pinata_api_key:`12b29849d878bf0ff562`,
            pinata_secret_api_key:`7651a6772ee5d2f07c0feb18d8b51a23cd11b9a66135a71067678a13cfbb420b`,
            "Content-Type":"multipart/form-data",
          },});
        setImage(`https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`);
      } catch (error){
        console.log("Unable to upload image to pinata");
      }
    }
  }
  
  const createNFT = async () => {
    console.log("hello 1");
    if (!image || !price || !name || !description) return setError('Data is missing');
    console.log(image);
    const data=JSON.stringify({image,price,name,description});
    try{
      console.log("hello 2");
      const response=await axios({
        method:"POST",
        url:"https://api.pinata.cloud/pinning/pinJSONToIPFS",
        data: data,
        headers:{
          'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI3YjM3N2I0Mi05ZTljLTRiOTUtYTJiZi05YmVmMDNkNTU5YTQiLCJlbWFpbCI6Im1kNDg5MzM4MUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiMTJiMjk4NDlkODc4YmYwZmY1NjIiLCJzY29wZWRLZXlTZWNyZXQiOiI3NjUxYTY3NzJlZTVkMmYwN2MwZmViMThkOGI1MWEyM2NkMTFiOWE2NjEzNWE3MTA2NzY3OGExM2NmYmI0MjBiIiwiaWF0IjoxNzE0MTAyNTE1fQ._aikZmmY6tKCaKHZwsr8XKWOyD6hxhz-bZ2S0l8M7Dw`,
          pinata_api_key:`12b29849d878bf0ff562`,
            pinata_secret_api_key:`7651a6772ee5d2f07c0feb18d8b51a23cd11b9a66135a71067678a13cfbb420b`,
            "Content-Type":"application/json",
        },
      });
      //const response = await pinata.pinJSONToIPFS(data);
      const url=`https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
      console.log(url)
      console.log("YEAAAA");
      await mintThenList(response)

    } catch(error) {
      console.log("hello 3");
      console.log("ipfs uri upload error: ", error)
    }
  }
  
  const mintThenList = async (response) => {
    const uri = `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`;
    // mint nft 
    await(await nft.mint(uri)).wait()
    // get tokenId of new nft 
    const id = await nft.tokenCount()
    // approve marketplace to spend nft
    await(await nft.setApprovalForAll(marketplace.address, true)).wait()
    // add nft to marketplace
    const listingPrice = ethers.utils.parseEther(price.toString())
    await(await marketplace.makeItem(nft.address, id, listingPrice)).wait()
  }
  return (
    <div className="container-fluid mt-5">
      <div className="row">
        <main role="main" className="col-lg-12 mx-auto" style={{ maxWidth: '1000px' }}>
          <div className="content mx-auto">
            <Row className="g-4">
              <Form.Control
                type="file"
                required
                name="file"
                onChange={uploadToIPFS}
              />
              <Form.Control onChange={(e) => setName(e.target.value)} size="lg" required type="text" placeholder="Name" />
              <Form.Control onChange={(e) => setDescription(e.target.value)} size="lg" required as="textarea" placeholder="Description" />
              <Form.Control onChange={(e) => setPrice(e.target.value)} size="lg" required type="number" placeholder="Price in ETH" />
              <div className="d-grid px-0">
                <Button onClick={createNFT} variant="primary" size="lg">
                  Create & List NFT!
                </Button>
              </div>
            </Row>
          </div>
        </main>
      </div>
    </div>
  );
}

export default Create