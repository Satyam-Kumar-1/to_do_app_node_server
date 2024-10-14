const getIPV4Adress = (req) => {
    const xForwardedFor = req.headers['x-forwarded-for'];
    if (xForwardedFor) {
        // x-forwarded-for can be a list of IPs, take the first one
        return xForwardedFor.split(',')[0].trim();
    }

    // Fallback to get the remote address
    const remoteAddress = req.connection.remoteAddress || req.socket.remoteAddress || 'Unknown IP';

    // Check if it's an IPv6-mapped IPv4 address and extract the IPv4 part
    if (remoteAddress.startsWith('::ffff:')) {
        return remoteAddress.substring(7); // Remove the IPv6 prefix to get the IPv4 address
    }

    return remoteAddress; // Return as is if it's not IPv6-mapped
}
module.exports={getIPV4Adress}